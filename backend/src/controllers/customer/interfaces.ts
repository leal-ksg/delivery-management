import { Customer } from "../../../generated/prisma";
import { HttpResponse } from "../../core/http-response";
import { Pagination } from "../../core/pagination";
import { Result } from "../../core/result";

export interface ICustomerRepository {
  findAll(
    itemsPerPage?: number,
    page?: number,
  ): Promise<Result<Pagination<Customer>>>;
  findById(id: string): Promise<Result<Customer | null>>;
  create(customer: Omit<Customer, "id">): Promise<Result<Customer>>;
  update(id: string, customer: Partial<Customer>): Promise<Result<Customer>>;
  delete(ids: string[]): Promise<Result<void>>;
}

export interface ICustomerController {
  getAllCustomers(
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<Customer>>>;
  getCustomerById(id: string): Promise<HttpResponse<Customer | null>>;
  createCustomer(
    customer: Omit<Customer, "id">,
  ): Promise<HttpResponse<Customer>>;
  updateCustomer(
    id: string,
    customer: Customer,
  ): Promise<HttpResponse<Customer>>;
  deleteCustomers(ids: string[]): Promise<HttpResponse<void>>;
}
