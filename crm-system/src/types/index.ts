export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

export interface Deal {
    id: string;
    title: string;
    value: number;
    stage: 'lead' | 'qualification' | 'proposal' | 'negotiation' | 'closed';
    clientId: string;
    expectedCloseDate: string;
    createdAt: string;
}

export interface EmailTemplate {
    id: string;
    name: string;
    subject: string;
    body: string;
    createdAt: string;
}