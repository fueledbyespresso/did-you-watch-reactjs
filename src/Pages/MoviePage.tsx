import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {MovieStatusCard} from "../Components/MovieCards/MovieStatusCard";

export function MoviePage() {
    const {id} = useParams();
    const [movie, setMovie] = useState<any>(null)
    const [displayAllCast, setDisplayAllCast] = useState<boolean>(false)

    function getShowByID() {
        setDisplayAllCast(false)
        fetch("https://api.themoviedb.org/3/movie/" + id + "?api_key=" + import.meta.env.VITE_TMDB_KEY + "&append_to_response=credits", {
            method: "GET",
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(
                (result) => {
                    setMovie(result)
                }, () => {

                }
            )
    }

    useEffect(() => {
        getShowByID()
    }, [id])

    if (movie === null) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <div className={"full-show-details"}>
                <div className={"show-details"}
                     style={{
                         background: `linear-gradient( rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.65) ),url("https://image.tmdb.org/t/p/original/` + movie.backdrop_path + `") no-repeat center bottom fixed`,
                         backgroundSize: "cover"
                     }}>

                    <img src={movie.poster_path !== null ?
                        "https://image.tmdb.org/t/p/w500/" + movie.poster_path :
                        "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg"}
                         className={"poster"}
                         alt={"show-poster"}/>
                    <div className={"text-details"}>
                        <h2>{movie.original_title}</h2>
                        <div>{movie.release_date}</div>
                        <div className={"overview"}>{movie.overview}</div>
                        <MovieStatusCard movieID={movie.id}/>

                    </div>
                </div>

                <h2>Cast
                    <button className={"toggle-full-cast"}
                            onClick={() => setDisplayAllCast(!displayAllCast)}>
                        Toggle Full Cast
                    </button>
                </h2>

                <div className={"credits"}>
                    {movie.credits && movie.credits.cast.map((cast: any, i: number) => {
                        if (!displayAllCast && i > 17) {
                            return null
                        }
                        return (
                            <div className={"cast-member"} key={cast.id}>
                                <Link to={"/actor/" + cast.id}>
                                    <img src={cast.profile_path !== null ?
                                        "https://image.tmdb.org/t/p/w500/" + cast.profile_path :
                                        "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg"}
                                         className={"poster"}
                                         alt={"show-poster"}/>
                                </Link>

                                <div className={"name"}>
                                    <b>{cast.name}</b> playing {cast.character}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}