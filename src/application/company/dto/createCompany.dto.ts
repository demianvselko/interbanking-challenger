export interface CreateCompanyRequest {
  cuit: string;
  name: string;
  type: string;
  accounts?: string[];
}
