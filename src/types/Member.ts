export type MemberType = 'Niño(a)' | 'Joven' | 'Sr.' | 'Sra.';
export type VisitReason = 'Visita por primera vez' | 'Me gustaría pertenecer a una iglesia' | 'Quisiera unirme a la iglesia' | 'Nuevo en el vecindario' | 'Deseo que un ministro me llame';
export type VisitType = 'Nuevo' | 'Asistió antes';

export interface Member {
    id: string;
    type: MemberType;
    date: string;
    fullName: string;
    age: number;
    phone: string;
    email: string;
    address: string;
    invitedBy: string;    visitReasons: VisitReason[];
    visitType: VisitType;
    requests: string;
    createdAt: string;
    updatedAt: string;
}
