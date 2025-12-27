import { IPlanPricing, IPlanTrial, PlanType } from './plan.interface';

export interface newPlanDTO {
    name: string;
    label: string;
    planType: PlanType;
    displayName: string;
    description: string;
    trial: IPlanTrial;
    pricing: IPlanPricing;
    members: {
        limit: number;
        frequency: string;
    };
    domains: {
        limit: number;
        frequency: string;
    };
    projects: {
        limit: number;
        frequency: string;
    };
}

export interface updatePlanDTO {
    planCode: string;
    updates: Partial<newPlanDTO>;
}
