import { useState, type FormEvent, type ChangeEvent } from 'react';
import type { Member, MemberType, VisitReason, VisitType } from '../../types/Member';
import './MemberForm.css';

interface MemberFormProps {
    member?: Member;
    onSubmit: (member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) => void;
    onCancel: () => void;
}

export const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {    const [formData, setFormData] = useState({
        type: member?.type || '' as MemberType,
        date: member?.date || new Date().toISOString().split('T')[0],
        fullName: member?.fullName || '',
        age: member?.age || '',
        phone: member?.phone || '',
        email: member?.email || '',
        address: member?.address || '',
        invitedBy: member?.invitedBy || '',        visitType: member?.visitType || 'Nuevo' as VisitType,
        visitReasons: member?.visitReasons || [] as VisitReason[],
        requests: member?.requests || ''
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit(formData as Omit<Member, 'id' | 'createdAt' | 'updatedAt'>);
    };

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'age' ? Number(value) || '' : value
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="member-form">
            <div className="form-group">
                <label>Tipo:</label>
                <div className="radio-group">
                    {['Niño(a)', 'Joven', 'Sr.', 'Sra.'].map(type => (
                        <label key={type}>
                            <input
                                type="radio"
                                name="type"
                                value={type}
                                checked={formData.type === type}
                                onChange={handleChange}
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="date">Fecha:</label>
                <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="fullName">Nombre completo:</label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="age">Edad:</label>
                <input
                    type="number"
                    id="age"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Teléfono/celular:</label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Correo electrónico:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label htmlFor="address">Dirección:</label>
                <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>            <div className="form-group">
                <label htmlFor="invitedBy">Viene invitado por:</label>
                <input
                    type="text"
                    id="invitedBy"
                    name="invitedBy"
                    value={formData.invitedBy}
                    onChange={handleChange}
                />
            </div>

            <div className="form-group">
                <label>Tipo de Visita:</label>
                <div className="radio-group visit-type-group">
                    {['Nuevo', 'Asistió antes'].map(type => (
                        <label key={type}>
                            <input
                                type="radio"
                                name="visitType"
                                value={type}
                                checked={formData.visitType === type}
                                onChange={handleChange}
                            />
                            {type}
                        </label>
                    ))}
                </div>
            </div>            <div className="form-group">
                <label>Razones de visita (seleccione las que apliquen):</label>
                <div className="checkbox-group">
                    {[
                        'Visita por primera vez',
                        'Me gustaría pertenecer a una iglesia',
                        'Quisiera unirme a la iglesia',
                        'Nuevo en el vecindario',
                        'Deseo que un ministro me llame'
                    ].map((reason) => (
                        <label key={reason}>
                            <input
                                type="checkbox"
                                name="visitReasons"
                                value={reason}
                                checked={formData.visitReasons.includes(reason as VisitReason)}
                                onChange={(e) => {
                                    const value = e.target.value as VisitReason;
                                    setFormData(prev => ({
                                        ...prev,
                                        visitReasons: e.target.checked 
                                            ? [...prev.visitReasons, value]
                                            : prev.visitReasons.filter(r => r !== value)
                                    }));
                                }}
                            />
                            {reason}
                        </label>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="requests">Peticiones:</label>
                <textarea
                    id="requests"
                    name="requests"
                    value={formData.requests}
                    onChange={handleChange}
                    rows={4}
                />
            </div>

            <div className="form-actions">
                <button type="submit">{member ? 'Actualizar' : 'Crear'}</button>
                <button type="button" onClick={onCancel}>Cancelar</button>
            </div>
        </form>
    );
};
