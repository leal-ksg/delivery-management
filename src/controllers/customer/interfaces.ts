import { HttpResponse } from "../../core/http-response";
import { Result } from "../../core/result";
import { Customer } from "../../models/customer";

export interface ICustomerRepository {
  findAll(): Promise<Result<Customer[]>>;
  findById(id: string): Promise<Result<Customer | null>>;
  create(customer: Omit<Customer, "id">): Promise<Result<Customer>>;
  update(id: string, customer: Partial<Customer>): Promise<Result<Customer>>;
  delete(id: string): Promise<Result<void>>;
}

export interface ICustomerController {
  getAllCustomers(): Promise<HttpResponse<Customer[]>>;
  getCustomerById(id: string): Promise<HttpResponse<Customer | null>>;
  createCustomer(customer: Omit<Customer, 'id'>): Promise<HttpResponse<Customer>>
  updateCustomer(id: string, customer: Customer): Promise<HttpResponse<Customer>>
  deleteCustomer(id: string): Promise<HttpResponse<void>>
}
