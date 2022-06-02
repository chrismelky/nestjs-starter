export abstract class BaseController {
  sendResponse(response: any) {
    if (response.page) {
      return {
        data: response.result,
        page: +response.page,
        perPage: +response.perPage,
        total: response.count,
        message: response.message,
      };
    }
    return {
      data: response.result,
    };
  }

  sendMessage(message: string) {
    return {
      message,
    };
  }
}
