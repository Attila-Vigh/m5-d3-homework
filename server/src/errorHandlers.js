// 404
export const notFoundErrorHandler = (err, req, res, next) => {
    err.status === 404
        ? res.status(404).send({ success: false, message: err.message })
        : next(err)
} 

// 400
export const badRequestErrorHandler = (err, req, res, next) => {
    err.status === 400
        ? res.status(400).send(err.errorsList)
        : next(err)
} 

// 403
export const forbiddenErrorHandler = (err, req, res, next) => {
    err.status === 403 
        ? res.status(403).send({ success: false, message: err.message })
        : next(err)
} 

// 500
export const genericServerErrorHandler = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({ success: false, message: "Generic Server Error" })
} 
