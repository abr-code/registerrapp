import type { Member } from '../types/Member';

export const mockMembers: Member[] = [
    {
        id: '1',
        type: 'Sr.',
        date: '2025-05-20',
        fullName: 'Juan Pérez',
        age: 35,
        phone: '555-0101',
        email: 'juan@email.com',
        address: 'Calle Principal 123',        invitedBy: 'Pastor David Ramírez',
        visitReason: 'Visita por primera vez',
        requests: 'Oración por mi familia',
        createdAt: '2025-05-20T10:00:00Z',
        updatedAt: '2025-05-20T10:00:00Z'
    },
    {
        id: '2',
        type: 'Sra.',
        date: '2025-05-21',
        fullName: 'Ana Martínez',
        age: 28,
        phone: '555-0102',
        email: 'ana@email.com',
        address: 'Avenida Central 456',        invitedBy: 'Hermana Laura Méndez',
        visitReason: 'Me gustaría pertenecer a una iglesia',
        requests: 'Bendición para mi negocio',
        createdAt: '2025-05-21T14:30:00Z',
        updatedAt: '2025-05-21T14:30:00Z'
    },
    {
        id: '3',
        type: 'Joven',
        date: '2025-05-22',
        fullName: 'Carlos Rodríguez',
        age: 19,
        phone: '555-0103',
        email: 'carlos@email.com',
        address: 'Plaza Mayor 789',        invitedBy: 'Ministerio de Jóvenes',
        visitReason: 'Nuevo en el vecindario',
        requests: 'Guía espiritual',
        createdAt: '2025-05-22T09:15:00Z',
        updatedAt: '2025-05-22T09:15:00Z'
    }
];
