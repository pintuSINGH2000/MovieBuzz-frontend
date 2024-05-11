export const gettingStart = () => ({
    type:"GETTING_START",
});

export const gettingSuccess = (myList) => ({
    type: "GETTING_SUCCESS",
    payload: myList
});

export const gettingFailure = () => ({
    type:"GETTING_FAILURE",
});

export const addingStart = () => ({
    type:"ADDING_START",
})
export const addingSuccess = (movie) => ({
    type:"ADDING_SUCCESS",
    payload:movie
})
export const addingFailure = () => ({
    type:"ADDING_FAILURE",
})

export const removingStart = () => ({
    type: "REMOVING_START",
})

export const removingSuccess = (id) => ({
    type: "REMOVING_SUCCESS",
    payload:id
})

export const removingFailure = () => ({
    type: "REMOVING_FAILURE",
})

export const LikeStart = () => ({
    type: "LIKE_START",
})

export const LikeSuccess = (movie,isLike) => ({
    type: "LIKE_SUCCESS",
    payload:{movie:movie,isLike:isLike}
})

export const LikeFailure = () => ({
    type: "LIKE_FAILURE"
})

export const DislikeSuccess = (movie,isDislike) => ({
    type: "DISLIKE_SUCCESS",
    payload:{movie:movie,isDislike:isDislike}
})

export const DislikeFailure = () => ({
    type: "DISLIKE_FAILURE"
})

export const DislikeStart = () => ({
    type: "DISLIKE_START"
})


