export abstract class BaseController {
  sendResponse(response: any) {
    if (response.page) {
      return {
        data: response.result,
        page: +response.page,
        size: +response.size,
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
