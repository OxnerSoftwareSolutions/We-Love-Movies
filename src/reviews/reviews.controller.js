const service = require("./reviews.service");
const asyncErrorBoundary = require("../Errors/asyncErrorBoundary")
// const hasProperties = require("../Errors/hasProperties")

// // const VALID_PROPERTIES = [
// //    "content",
// //    "score",
// //   ];

// //   function hasOnlyValidProperties(req, res, next) {
// //     const { data = {} } = req.body;
  
// //     const invalidFields = Object.keys(data).filter(
// //       (field) => !VALID_PROPERTIES.includes(field)
// //     );
  
// //     if (invalidFields.length)
// //       return next({
// //         status: 400,
// //         message: `Invalid field(s): ${invalidFields.join(", ")}`,
// //       });
// //     next();
// //   }
  
// //   const hasRequiredProperties = hasProperties(...VALID_PROPERTIES);

// // const hasParams = async (req, res, next) => {
// //     const { reviewId } = req.params;
// //     const match = await service.read(reviewId);
// //     if (match.length === 0 || !reviewId)
// //       return next({
// //         status: 404,
// //         message: `Review cannot be found.`,
// //       });
// //     res.locals.review = match[0];
// //     next();
// //   }; 

// //   function hasBody(req, res, next) {
// //     const { data: { score, content } } = req.body;
// //     let updateObj = {};
// //     if (!score && !content)
// //       return next({ status: 400, message: "Missing score or content in body" });
// //     if (score) updateObj.score = score;
// //     if (content) updateObj.content = content;
// //     res.locals.update = updateObj;
// //     next();
// //   }

// async function reviewExists(req, res, next) {
//     const review = await service.read(req.params.reviewId);
  
//     if (review) {
//       res.locals.review = review;
//       return next();
//     }
//     next({ status: 404, message: `Review cannot be found.` });
//   }

//   function hasMovieIdInPath(req, res, next) {
//     if (req.params.movieId) {
//       return next();
//     }
//     methodNotAllowed(req, res, next);
//   }
  
//   function noMovieIdInPath(req, res, next) {
//     if (req.params.movieId) {
//       return methodNotAllowed(req, res, next);
//     }
//     next();
//   }
  

async function list(req, res) {
    const reviews = await service.list();
    res.status(200).json({data:reviews});
}

// async function list(req, res) {
//     const data = await service.list(req.params.movieId);
//     res.json({ data });
//   }

async function read(req, res) {
    res.status(200).json({data: res.locals.review});
}

async function reviewExists(req, res, next) {
    const review = await service.read(req.params.reviewId);
  
    if (review) {
      res.locals.review = review;
      return next();
    }
    next({ status: 404, message: `Review cannot be found.` });
  }
  
  async function destroy(req, res) {
    await service.destroy(res.locals.review.review_id);
    res.sendStatus(204);
  }
  
  function hasMovieIdInPath(req, res, next) {
    if (req.params.movieId) {
      return next();
    }
    methodNotAllowed(req, res, next);
  }
  
  function noMovieIdInPath(req, res, next) {
    if (req.params.movieId) {
      return methodNotAllowed(req, res, next);
    }
    next();
  }
  
  async function update(req, res) {
    const updatedReview = {
      ...res.locals.review,
      ...req.body.data,
      review_id: res.locals.review.review_id,
    };
    const data = await service.update(updatedReview);
    res.json({ data });
  }
  
  module.exports = {
    read: asyncErrorBoundary(read),
    destroy: [
      noMovieIdInPath,
      asyncErrorBoundary(reviewExists),
      asyncErrorBoundary(destroy),
    ],
    list: [hasMovieIdInPath, asyncErrorBoundary(list)],
    update: [
      noMovieIdInPath,
      asyncErrorBoundary(reviewExists),
      asyncErrorBoundary(update),
    ],
  };