import type { Member } from '../types/Member';
import { mockMembers } from './mockData';

class MemberService {
    private members: Member[] = [...mockMembers];

    async getAll(): Promise<Member[]> {
        return Promise.resolve([...this.members]);
    }

    async create(member: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>): Promise<Member> {
        const newMember: Member = {
            ...member,
            id: Math.random().toString(36).substr(2, 9),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.members.push(newMember);
        return Promise.resolve(newMember);
    }

    async update(id: string, member: Partial<Member>): Promise<Member> {
        const index = this.members.findIndex(m => m.id === id);
        if (index === -1) {
            throw new Error('Member not found');
        }

        const updatedMember = {
            ...this.members[index],
            ...member,
            updatedAt: new Date().toISOString()
        };
        this.members[index] = updatedMember;
        return Promise.resolve(updatedMember);
    }

    async delete(id: string): Promise<void> {
        const index = this.members.findIndex(m => m.id === id);
        if (index === -1) {
            throw new Error('Member not found');
        }
        this.members.splice(index, 1);
        return Promise.resolve();
    }

    async search(query: string, field?: keyof Member): Promise<Member[]> {
        const lowercaseQuery = query.toLowerCase();
        return Promise.resolve(
            this.members.filter(member => {
                if (field) {
                    const value = member[field];
                    return String(value).toLowerCase().includes(lowercaseQuery);
                }
                
                return Object.values(member).some(
                    value => String(value).toLowerCase().includes(lowercaseQuery)
                );
            })
        );
    }
}

export const memberService = new MemberService();
