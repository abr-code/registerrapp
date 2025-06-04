import { useRef } from 'react';
import { memberService } from '../../services/memberService';
import './ExportImport.css';

interface ExportImportProps {
    onImportComplete?: () => void;
    onError?: (message: string) => void;
}

export const ExportImport = ({ onImportComplete, onError }: ExportImportProps) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleExport = async () => {
        try {
            const jsonData = await memberService.exportToJson();
            
            // Create blob and download link
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `miembros-${new Date().toISOString().split('T')[0]}.json`;
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            onError?.(error instanceof Error ? error.message : 'Error al exportar los datos');
        }
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();        reader.onload = async (e) => {
            try {
                const jsonData = e.target?.result as string;
                const result = await memberService.importFromJson(jsonData);
                onImportComplete?.();
                
                // Create a detailed message about the import results
                const messages = [];
                messages.push(`✅ ${result.imported} registros importados exitosamente.`);
                
                if (result.skipped.duplicates > 0) {
                    messages.push(
                        `⚠️ ${result.skipped.duplicates} registros duplicados:`,
                        result.skipped.duplicateNames.join(', ')
                    );
                }
                
                if (result.skipped.invalid > 0) {
                    messages.push(`❌ ${result.skipped.invalid} registros inválidos omitidos.`);
                }
                
                onError?.(messages.join('\n'));

                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                onError?.(error instanceof Error ? error.message : 'Error al importar los datos');
            }
        };

        reader.onerror = () => {
            onError?.('Error al leer el archivo');
        };

        reader.readAsText(file);
    };

    return (
        <div className="export-import-container">
            <button onClick={handleExport} className="export-import-button">
                📥 Exportar a JSON
            </button>
            <button onClick={handleImportClick} className="export-import-button import-button">
                📤 Importar desde JSON
            </button>
            <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>
    );
};
