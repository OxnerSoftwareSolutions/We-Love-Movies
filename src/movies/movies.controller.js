const asyncErrorBoundary = require("../Errors/asyncErrorBoundary");
const service = require("./movies.service");

const hasParams = async (req, res, next) => {
    const { movieId } = req.params;
    const match = await service.read(Number(movieId));
    if (match.length === 0 || !movieId)
      return next({
        status: 404,
        message: `movieId: ${movieId} does not exist in the database`,
      });
    res.locals.movies = match[0];
    next();
  }; 

async function list(req, res) {
    const {is_showing} = req.query;
    const data = is_showing
    if (is_showing === "true") {
        const data = await service.listShowing()
        res.status(200).json({data});
    } else {
        const data = await service.list();
        res.status(200).json({data});
    }
        // ? await (await service.listShowing())
        // : await service.list();
    // const data = await service.list();
    console.log(data)
    res.status(200).json({data});
}

async function read(req, res) {
    res.status(200).json({data:res.locals.movies});
}

async function listReviews(req, res) {
    const movieId = res.locals.movies.movie_id;
    const reviews = await service.listReviews(movieId);
    const allReviews = [];
    for (let i = 0; i < reviews.length; i++) {
      const review = reviews[i];
      const critic = await service.getCritics(review.critic_id);
      review.critic = critic[0];
      allReviews.push(review);
    }
    res.status(200).json({ data: allReviews });
  }

  async function listTheaters(req, res) {
    const movieId = res.locals.movies.movie_id;
    const result = await service.listTheaters(movieId);
    res.status(200).json({ data: result });
  }

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(hasParams),
            asyncErrorBoundary(read)],
    listReviews: [asyncErrorBoundary(hasParams),
                asyncErrorBoundary(listReviews)],
    listTheaters: [asyncErrorBoundary(hasParams),
                    asyncErrorBoundary(listTheaters)],
}