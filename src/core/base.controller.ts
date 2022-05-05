export abstract class BaseController {
  sendResponse(response: any) {
    return {
      data: response.result,
      page: +response.page,
      perPage: +response.perPage,
      total: response.count,
      message: response.message,
    };
  }

  sendMessage(message: string) {
    return {
      message,
    };
  }
}
