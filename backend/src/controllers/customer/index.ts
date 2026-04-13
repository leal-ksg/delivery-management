import { Customer } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { Pagination } from "../../core/pagination";
import { ICustomerController, ICustomerRepository } from "./interfaces";

export class CustomerController implements ICustomerController {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async getAllCustomers(
    itemsPerPage?: number,
    page?: number,
  ): Promise<HttpResponse<Pagination<Customer>>> {
    const result = await this.customerRepository.findAll(itemsPerPage, page);

    return toHttpResponse(result);
  }

  async getCustomerById(id: string): Promise<HttpResponse<Customer | null>> {
    const result = await this.customerRepository.findById(id);

    return toHttpResponse(result);
  }

  async createCustomer(
    customer: Omit<Customer, "id">,
  ): Promise<HttpResponse<Customer>> {
    const result = await this.customerRepository.create(customer);

    return toHttpResponse(result, 201);
  }

  async updateCustomer(
    id: string,
    customer: Customer,
  ): Promise<HttpResponse<Customer>> {
    const result = await this.customerRepository.update(id, customer);

    return toHttpResponse(result);
  }

  async deleteCustomers(ids: string[]): Promise<HttpResponse<void>> {
    const result = await this.customerRepository.delete(ids);

    return toHttpResponse(result);
  }
}
