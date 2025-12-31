import { Customer } from "../../../generated/prisma";
import { HttpResponse, toHttpResponse } from "../../core/http-response";
import { ICustomerController, ICustomerRepository } from "./interfaces";

export class CustomerController implements ICustomerController {
  constructor(private readonly customerRepository: ICustomerRepository) {}

  async getAllCustomers(): Promise<HttpResponse<Customer[]>> {
    const result = await this.customerRepository.findAll();

    return toHttpResponse(result);
  }

  async getCustomerById(id: string): Promise<HttpResponse<Customer | null>> {
    const result = await this.customerRepository.findById(id);

    return toHttpResponse(result);
  }

  async createCustomer(
    customer: Omit<Customer, "id">
  ): Promise<HttpResponse<Customer>> {
    const result = await this.customerRepository.create(customer);

    return toHttpResponse(result);
  }

  async updateCustomer(
    id: string,
    customer: Customer
  ): Promise<HttpResponse<Customer>> {
    const result = await this.customerRepository.update(id, customer);

    return toHttpResponse(result);
  }

  async deleteCustomer(id: string): Promise<HttpResponse<void>> {
    const result = await this.customerRepository.delete(id);

    return toHttpResponse(result);
  }
}
