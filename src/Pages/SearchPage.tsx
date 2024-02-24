import {useState} from "react";
import {User} from "../Types/User.tsx";
import {Link} from "react-router-dom";
import {Movie} from "../Types/Movie.tsx";
import {Show} from "../Types/Show.tsx";
import {Actor} from "../Types/Actor.tsx";

export function SearchPage() {
    const [curCategory, setCurCategory] = useState<string>("multi")
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [searchResults, setSearchResults] = useState<any>(null)

    function submitSearch(searchCategory: string | null | undefined) {
        if (searchQuery === ""){
            setSearchResults(null)
            return
        }
        let endpoint ="https://api.themoviedb.org/3/search/"+searchCategory+"?api_key=" + import.meta.env.VITE_TMDB_KEY + "&query=" + searchQuery + "&page=1"
        if (searchCategory === "users"){
            endpoint = import.meta.env.VITE_HOST + "/api/v1/search/users/"+searchQuery
        }
        fetch(endpoint, {
            method: "GET",
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(
                (result) => {
                    setSearchResults(result.results)
                }, (error) => {
                    console.log(error)
                }
            )
    }

    return (
        <div className={"search-page"}>
            <div className={"search-bar"}>
                <input className={"search-input"}
                       tabIndex={2}
                       value={searchQuery}
                       onChange={event => setSearchQuery(event.target.value)}
                       onKeyUp={() => (submitSearch(curCategory))}
                       placeholder={"Search..."}
                       autoFocus={true}/>
                <fieldset>
                    <label className={curCategory === "multi" ? "active":""}>
                        <input type={"radio"} name={"category"}
                               checked={curCategory === "multi"}
                               onChange={() => {
                                   setCurCategory("multi")
                                   submitSearch("multi")
                               }}/>
                        Multi
                    </label>
                    <label className={curCategory === "movie" ? "active":""}>
                        <input type={"radio"} name={"category"}
                               checked={curCategory === "movie"}
                               onChange={() => {
                                   setCurCategory("movie")
                                   submitSearch("movie")
                               }}/>
                        Movies
                    </label>
                    <label className={curCategory === "tv" ? "active":""}>
                        <input type={"radio"} name={"category"}
                               checked={curCategory === "tv"}
                               onChange={() => {
                                   setCurCategory("tv")
                                   submitSearch("tv")
                               }}
                        />
                        Shows
                    </label>
                    <label className={curCategory === "person" ? "active":""}>
                        <input type={"radio"} name={"category"}
                               checked={curCategory === "person"}
                               onChange={() => {
                                   setCurCategory("person")
                                   submitSearch("person")
                               }}
                        />
                        People
                    </label>
                    <label className={curCategory === "users" ? "active":""}>
                        <input type={"radio"} name={"category"}
                               checked={curCategory === "users"}
                               onChange={() => {
                                   setCurCategory("users")
                                   submitSearch("users")
                               }}
                        />
                        Users
                    </label>
                </fieldset>
            </div>
            {searchResults !== null && <div className="results">
                {searchResults.map((searchResult: any) => {
                    const media = searchResult.media_type || curCategory
                    switch (media) {
                        case "tv":
                            return <TVSR show={searchResult} key={searchResult.id}/>
                        case "movie":
                            return <MovieSR movie={searchResult} key={searchResult.id}/>
                        case "user":
                            return <User user={searchResult} key={searchResult.key}/>
                        case "person":
                            return <ActorSR actor={searchResult} key={searchResult.id}/>
                        default:
                            return <div></div>
                    }
                })}
            </div>}
        </div>
    )
}

export function MovieSR(props: {
    movie: Movie,
}) {
    return (
        <div className={"moviesr-details"}>
            <img src={(props.movie.poster_path === "" || props.movie.poster_path === null) ?
                "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg" :
                "https://image.tmdb.org/t/p/w500/" + props.movie.poster_path}
                 className={"poster"}
                 alt={"show-poster"}/>
            <div className={"text-details"}>
                <Link to={"/movie/" + props.movie.id} onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                }}>
                    {props.movie.original_title}
                </Link>
                <div className={"overview"}>{props.movie.overview}</div>
            </div>
        </div>
    )
}

export function TVSR(props: {
    show: Show,
}) {
    return (
        <div className={"moviesr-details"}>
            <img src={(props.show.poster_path === "" || props.show.poster_path === null) ?
                "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg" :
                "https://image.tmdb.org/t/p/w500/" + props.show.poster_path}
                 className={"poster"}
                 alt={"show-poster"}/>
            <div className={"text-details"}>
                <Link to={"/show/" + props.show.id} onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                }}>
                    {props.show.original_name}
                </Link>
                <div className={"overview"}>{props.show.overview}</div>
            </div>
        </div>
    )
}

export function ActorSR(props: {
    actor: Actor,
}) {
    return (
        <div className={"moviesr-details"}>
            <img src={(props.actor.profile_path === "" || props.actor.profile_path === null) ?
                "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg" :
                "https://image.tmdb.org/t/p/w500/" + props.actor.profile_path}
                 className={"poster"}
                 alt={"show-poster"}/>
            <div className={"text-details"}>
                <Link to={"/actor/" + props.actor.id} onClick={() => {
                    if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                    }
                }}>
                    {props.actor.name}
                </Link>
                <div className={"overview"}>Known for {props.actor.known_for_department}</div>
            </div>
        </div>
    )
}