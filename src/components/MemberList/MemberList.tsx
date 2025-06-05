import type { Member } from '../../types/Member';
import './MemberList.css';

interface MemberListProps {
    members: Member[];
    onEdit: (member: Member) => void;
    onDelete: (id: string) => void;
}

export const MemberList = ({ members, onEdit, onDelete }: MemberListProps) => {
    return (
        <div className="member-list">
            <table>
                <thead>                    
                    <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Nombre</th>
                        <th>Edad</th>
                        <th>Teléfono</th>                        
                        <th>Email</th>
                        <th>Tipo de Visita</th>
                        <th>Viene invitado por</th>
                        <th>Razón de visita</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {members.map(member => (
                        <tr key={member.id}>
                            <td>{new Date(member.date).toLocaleDateString()}</td>
                            <td>{member.type}</td>
                            <td>{member.fullName}</td>                           
                            <td>{member.age}</td>
                            <td>{member.phone}</td>
                            <td>{member.email}</td>                              
                            <td>{member.visitType}</td>
                            <td>{member.invitedBy}</td>
                            <td>{member.visitReasons?.join(', ') || '-'}</td>
                            <td>
                                <button 
                                    onClick={() => onEdit(member)}
                                    className="edit-button"
                                >
                                    Editar
                                </button>
                                <button 
                                    onClick={() => onDelete(member.id)}
                                    className="delete-button"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
