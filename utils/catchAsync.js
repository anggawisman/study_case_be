// we pass function or we called fn to wrap by catchAsync
// We need next function to pass the error. So, error can handle by globalErrorHandle.

// catch(next) to catch from function async while use this function

// We should return the req, res, next because if not the req, res, next in the fn is not defined

module.exports = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
