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
    where,
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
                    }

                    // Search in common searchable fields
                    const searchableFields = ['fullName', 'email', 'phone', 'address', 'type', 'visitReason', 'invitedBy'];
                    return searchableFields.some(field => {
                        const value = member[field as keyof Member];
                        return value && value.toString().toLowerCase().includes(searchTermLower);
                    });
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
}

export const memberService = new MemberService();
