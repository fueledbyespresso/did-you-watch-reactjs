import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";

export function ActorPage() {
    const {id} = useParams()
    const [actor, setActor] = useState<any>(null)
    const [showAllCredits, setShowAllCredits] = useState<boolean>(false)

    function getShowByID() {
        fetch("https://api.themoviedb.org/3/person/" + id + "?append_to_response=combined_credits&api_key="+import.meta.env.VITE_TMDB_KEY, {
            method: "GET",
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(
                (result) => {
                    result.combined_credits.cast.sort(compare);
                    setActor(result)
                }, (error) => {
                    console.log(error)
                }
            )
    }

    useEffect(() => {
        getShowByID()
    }, [id])

    if (actor === null) {
        return <div>Loading...</div>
    }

    function compare(a: any, b: any) {
        const aDate = a.release_date || a.first_air_date
        const bDate = b.release_date || b.first_air_date
        if (aDate > bDate) {
            return -1;
        }
        if (aDate < bDate) {
            return 1;
        }
        return 0;
    }

    function birthday(): string{
        if(actor.birthday === null){
            return "No birthday given"
        }
        let bDay

        if(actor.deathday !== null){
            bDay = actor.deathday.substring(0, 4) - actor.birthday.substring(0, 4)
        }else {
            bDay = new Date().getFullYear() - actor.birthday?.substring(0, 4) - 1
        }
        return bDay.toString()
    }

    return (
        <div className={"actor-page"}>
            <div className={"details"}>
                <img src={actor.profile_path !== null ?
                    "https://image.tmdb.org/t/p/w300/" + actor.profile_path :
                    "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg"}
                     className={"headshot"}
                     alt={"actor-headshot"}/>
                <div className={"text-details"}>
                    <h1 className={"name"}>{actor?.name} ({birthday()})</h1>
                    <div className={"biography"}>
                        <h2>Biography</h2>
                        <div>{actor?.biography}</div>
                    </div>
                </div>
            </div>

            <div className={"credits"}>
                <h2>Credits <button onClick={() => setShowAllCredits(!showAllCredits)}>Toggle Full Credits</button></h2>
                {actor.combined_credits.cast.map((film: any, i: number) => {
                    if (!showAllCredits && i > 17) {
                        return null
                    }
                    return (
                        <div className={"credit"} key={film.credit_id}>
                            <Link to={film.media_type === "movie" ? "/movie/" + film.id : "/show/" + film.id}>
                                <img src={film.poster_path !== null ?
                                    "https://image.tmdb.org/t/p/w300/" + film.poster_path :
                                    "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg"}
                                     className={"poster"}
                                     alt={"poster"}/>
                            </Link>

                            <div className={"title"}>
                                <Link to={film.media_type === "movie" ? "/movie/" + film.id : "/show/" + film.id}>
                                    {film.title || film.name} ({(new Date(film.release_date || film.first_air_date)).toDateString()})
                                </Link>
                            </div>
                            <div>As {film.character === "" ? "Unknown" : film.character}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}