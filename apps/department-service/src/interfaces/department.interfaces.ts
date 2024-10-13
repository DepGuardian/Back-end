export interface CreateDepartmentDto {
  idDepa: string;
  name?: string;
  owner?: string;
  family?: string[];
  capacity: number;
  number?: number;
  status: 'free' | 'busy' | 'maintenance';
}