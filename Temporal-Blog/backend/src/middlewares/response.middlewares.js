function responseHandler(
  { ok, statusCode, message, details, body, token },
  res
) {
  res.status(statusCode).json({
    ok,
    statusCode,
    timestamp: new Date().toISOString(),
    message,
    details,
    body,
    token
  })
}

export function errorHandler(error, req, res, next) {
  responseHandler(
    {
      ok: false,
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error',
      details: error.details || null,
      body: null
    },
    res
  )
}

export function successHandler(body, req, res, next) {
  responseHandler(
    {
      ok: true,
      statusCode: 200,
      message: 'Success',
      details: null,
      body: body
    },
    res
  )
}

export function errorTokenHandler(error, req, res, next) {
  responseHandler(
    {
      ok: false,
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal Server Error',
      details: error.details || null,
      token: null
    },
    res
  )
}

export function successTokenHandler(token, req, res, next) {
  responseHandler(
    {
      ok: true,
      statusCode: 200,
      message: 'Login successfully',
      details: null,
      token: token
    },
    res
  )
}
