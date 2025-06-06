import type { Member } from '../types/Member';
import { 
    collection, 
    getDocs, 
    getDoc,
    addDoc, 
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp,
   type DocumentData
} from 'firebase/firestore';
import { db } from '../config/firebase';

class MemberService {
    private readonly collectionName = 'members';

    private convertToMember(doc: DocumentData): Member {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            date: data.date,
            createdAt: data.createdAt?.toDate().toISOString(),
            updatedAt: data.updatedAt?.toDate().toISOString()
        };
    }

    async getAll(): Promise<Member[]> {
        try {
            const querySnapshot = await getDocs(
                query(
                    collection(db, this.collectionName),
                    orderBy('createdAt', 'desc')
                )
            );
            
            return querySnapshot.docs.map(this.convertToMember);
        } catch (error) {
            console.error('Error fetching members:', error);
            throw new Error('Error al obtener los miembros');
        }
    }    async search(searchQuery: string, field?: keyof Member): Promise<Member[]> {
        try {
            if (!searchQuery) return this.getAll();

            // Get all documents and filter in memory for case-insensitive search
            const querySnapshot = await getDocs(collection(db, this.collectionName));
            const searchTermLower = searchQuery.toLowerCase();

            return querySnapshot.docs
                .map(this.convertToMember)
                .filter(member => {
                    if (field) {
                        const value = member[field];
                        return value && value.toString().toLowerCase().includes(searchTermLower);
                    }                    // Search in common searchable fields
                    const searchableFields = ['fullName', 'email', 'phone', 'address', 'type', 'invitedBy'];
                    return searchableFields.some(field => {
                        const value = member[field as keyof Member];
                        return value && value.toString().toLowerCase().includes(searchTermLower);
                    }) || member.visitReasons.some(reason => 
                        reason.toLowerCase().includes(searchTermLower)
                    );
                });        } catch (error) {
            console.error('Error searching members:', error);
            throw new Error('Error al buscar miembros');
        }
    }

    async create(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> {
        try {
            const now = Timestamp.now();
            const docRef = await addDoc(collection(db, this.collectionName), {
                ...member,
                createdAt: now,
                updatedAt: now
            });

            const docSnap = await getDoc(docRef);
            return this.convertToMember(docSnap);
        } catch (error) {
            console.error('Error creating member:', error);
            throw new Error('Error al crear el miembro');
        }
    }

    async update(id: string, member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> {
        try {
            const docRef = doc(db, this.collectionName, id);
            const updateData = {
                ...member,
                updatedAt: Timestamp.now()
            };

            await updateDoc(docRef, updateData);
            const docSnap = await getDoc(docRef);
            
            if (!docSnap.exists()) {
                throw new Error('Member not found');
            }

            return this.convertToMember(docSnap);
        } catch (error) {
            console.error('Error updating member:', error);
            throw new Error('Error al actualizar el miembro');
        }
    }

    async delete(id: string): Promise<void> {
        try {
            const docRef = doc(db, this.collectionName, id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting member:', error);
            throw new Error('Error al eliminar el miembro');
        }
    }

    async exportToJson(): Promise<string> {
        try {
            const members = await this.getAll();
            return JSON.stringify(members, null, 2);
        } catch (error) {
            console.error('Error exporting members:', error);
            throw new Error('Error al exportar los miembros');
        }
    }    async importFromJson(jsonData: string): Promise<{ 
        imported: number;
        skipped: { 
            duplicates: number;
            invalid: number;
            duplicateNames: string[];
        };
    }> {
        try {
            let data;
            try {
                data = JSON.parse(jsonData);
            } catch (e) {
                throw new Error('El archivo JSON no tiene un formato válido');
            }

            if (!Array.isArray(data)) {
                throw new Error('El archivo debe contener un array de miembros');
            }            // Get existing members for duplicate checking
            const querySnapshot = await getDocs(collection(db, this.collectionName));
            const existingMembers = querySnapshot.docs.map(this.convertToMember);
            
            let imported = 0;
            let duplicates = 0;
            let invalid = 0;
            let duplicateNames: string[] = [];

            // Process each member
            for (const member of data) {
                // Skip invalid members
                if (!this.isValidMember(member)) {
                    invalid++;
                    continue;
                }

                const { id, ...memberData } = member;
                
                // Check for duplicates using full name
                if (this.isDuplicateMember(memberData, existingMembers)) {
                    duplicates++;
                    duplicateNames.push(memberData.fullName);
                    continue;
                }

                const timestamp = Timestamp.now();
                await addDoc(collection(db, this.collectionName), {
                    ...memberData,
                    createdAt: timestamp,
                    updatedAt: timestamp
                });
                
                imported++;
                // Add to existing members to check for duplicates in the same import batch
                existingMembers.push({ ...memberData, id: 'temp-id' } as Member);
            }            return {
                imported,
                skipped: {
                    duplicates,
                    invalid,
                    duplicateNames
                }
            };} catch (error) {
            console.error('Error importing members:', error);
            if (error instanceof Error) {
                throw new Error(`Error al importar miembros: ${error.message}`);
            }
            throw new Error('Error al importar miembros');
        }
    }

    private isDuplicateMember(memberData: Omit<Member, 'id'>, existingMembers: Member[]): boolean {
        return existingMembers.some(
            existing => existing.fullName.toLowerCase() === memberData.fullName.toLowerCase()
        );
    }    private isValidMember(member: any): member is Member {
        return (
            typeof member === 'object' &&
            member !== null &&
            typeof member.fullName === 'string' &&
            typeof member.type === 'string' &&
            typeof member.age === 'number' &&
            typeof member.phone === 'string' &&
            typeof member.email === 'string' &&
            typeof member.invitedBy === 'string' &&            Array.isArray(member.visitReasons) &&
            member.visitReasons.every((reason: unknown) => typeof reason === 'string') &&
            typeof member.visitType === 'string' &&
            ['Nuevo', 'Asistió antes'].includes(member.visitType)
        );
    }
}

export const memberService = new MemberService();
