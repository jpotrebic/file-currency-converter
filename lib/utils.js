'use strict'

function sendResponse(self, data, code, status)
{
    self.status = code || 200
    self.body = {
        status: status || 'ok',
        data: data || []
    }
}

function sendError(self, message, code, details, status)
{
    self.status = code || 400

    if (!message && !details)
        data = []

    self.body = {
        status: status || 'error',
        data:
        {
            message: message,
            details: details
        }
    }
}

// Module exports
exports.sendResponse = sendResponse
exports.sendError = sendError
