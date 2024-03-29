import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {ShowStatusButtons} from "../Components/ShowCards/ShowStatusButtons";
import {RootState, UserState} from "../Store/userSlice.ts";
import {useSelector} from "react-redux";

export function TVShowPage() {
    type season = {
        loading: boolean;
        name: string;
        episodes: any;
    }
    const {id} = useParams()
    const [show, setShow] = useState<any>(null)
    const [selectedSeason, setSelectedSeason] = useState<any>(null)
    const [seasons, setSelectedSeasons] = useState<Map<number, season>>(new Map<number, season>())

    const [episodesWatched, setEpisodesWatched] = useState<number[]>([])

    const [displayAllCast, setDisplayAllCast] = useState<boolean>(false)
    const user = useSelector<RootState, UserState>((state) => state.user);

    function getShowByID() {
        setDisplayAllCast(false)
        fetch("https://api.themoviedb.org/3/tv/" + id +"?api_key=" + import.meta.env.VITE_TMDB_KEY + "&append_to_response=aggregate_credits", {
            method: "GET",
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(
                (result) => {
                    const mapOfSeasons = new Map<number, season>();
                    result.seasons.forEach((curSeason:any) => {
                        if(curSeason.air_date !== null && curSeason.poster_path !== null){
                            const tempSeason: season = {
                                loading: true,
                                name: curSeason.name,
                                episodes: null,
                            }
                            mapOfSeasons.set(curSeason.season_number, tempSeason)
                        }
                    })

                    setSelectedSeasons(mapOfSeasons)
                    setShow(result)
                }, () => {

                }
            )
    }

    function getSeasonByID(seasonID: any) {
        fetch("https://api.themoviedb.org/3/tv/" + id + "/season/" + seasonID + "?api_key=" + import.meta.env.VITE_TMDB_KEY, {
            method: "GET",
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(
                (result) => {
                    const mapOfSeasons = seasons
                    mapOfSeasons.set(seasonID, {
                        loading: false,
                        name:result.name,
                        episodes: result.episodes,
                    })
                    setSelectedSeasons(mapOfSeasons)
                    setSelectedSeason(seasonID)
                }, () => {

                }
            )
    }
    function getEpisodesWatched(seasonID: any) {
        if (user.profile === null){
            return
        }
        fetch(import.meta.env.VITE_HOST+"/api/v1/tv/"+id+"/season/"+seasonID, {
            method: "GET",
            headers: {
                'AuthToken': user.profile.idToken
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(
                (result) => {
                    console.log(result)
                    setEpisodesWatched(result)
                }, () => {

                }
            )
    }

    function selectSeason(seasonID: any){
        if(seasons.get(seasonID)?.loading ){
            getSeasonByID(seasonID)
        }else{
            setSelectedSeason(seasonID)
        }
        setEpisodesWatched([])
        getEpisodesWatched(seasonID)
    }

    useEffect(() => {
        getShowByID()
    }, [id])

    if (show === null) {
        return <div>Loading...</div>
    }

    function markWatched(season_number: number, episode_number: number) {
        if (user.profile == null){
            return
        }
        fetch(import.meta.env.VITE_HOST + "/api/v1/tv/" + id + "/season/" + season_number + "/episode/"+episode_number, {
            method: "PUT",
            headers: {
                'AuthToken': user.profile.idToken
            }
        }).then((res) => {
                if (res.ok) {
                    return res.json()
                }
            })
            .then(
                () => {
                    setEpisodesWatched(episodesWatched => [...episodesWatched, episode_number])
                    console.log("WHOO HOO")
                }, () => {
                }
            )
    }
    function markUnwatched(season_number: number, episode_number: number) {
        if (user.profile == null){
            return
        }
        fetch(import.meta.env.VITE_HOST + "/api/v1/tv/" + id + "/season/" + season_number + "/episode/"+episode_number, {
            method: "DELETE",
            headers: {
                'AuthToken': user.profile.idToken
            }
        }).then((res) => {
            if (res.ok) {
                return res.json()
            }
        })
            .then(
                () => {
                    const index = episodesWatched.indexOf(episode_number)
                    console.log(index)
                    if( index !== -1){
                        const eps = [...episodesWatched]
                        eps.splice(index, 1)

                        setEpisodesWatched(eps)
                    }
                    console.log("BOO HOO")
                }, () => {
                }
            )
    }
    const matchingShow = user.profile?.tvList.find(curShow => {
        return curShow.id === Number(id)
    })
    return (
        <div>
            <div className={"full-show-details"}>
                <div className={"show-details"}
                     style={{
                         background: `linear-gradient( rgba(0, 0, 0, 0.25), rgba(0, 0, 0, 0.65) ),url("https://image.tmdb.org/t/p/original/` + show.backdrop_path + `") no-repeat center top fixed`,
                         backgroundSize: "cover"
                     }}>

                    <img src={show.poster_path !== null ?
                        "https://image.tmdb.org/t/p/w500/" + show.poster_path :
                        "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg"}
                         className={"poster"}
                         alt={"show-poster"}/>
                    <div className={"text-details"}>
                        <h2>{show.original_name}</h2>
                        <div>{show.first_air_date}</div>
                        {matchingShow !== undefined && matchingShow?.last_episode_title !== "" &&
                            <div><b>Last Episode Watched: </b>
                                S{matchingShow?.last_episode_season}E{matchingShow?.last_episode_number} {matchingShow?.last_episode_title}
                            </div>
                        }
                        <div className={"overview"}>{show.overview}</div>
                        <ShowStatusButtons showID={show.id}/>
                    </div>
                </div>
                <section className={"next-episode-to-air"}>
                    {show.next_episode_to_air !== null &&
                        <div>
                            <h2>Next episode airs on {(new Date(show.next_episode_to_air.air_date+"PST")).toDateString()}</h2>
                            <img src={show.next_episode_to_air.still_path !== null ?
                                "https://image.tmdb.org/t/p/w500/" + show.next_episode_to_air.still_path :
                                "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg"}/>
                            <div>Episode {show.next_episode_to_air.episode_number}: {show.next_episode_to_air.name}</div>
                            <div>{show.next_episode_to_air.overview}</div>
                        </div>
                    }
                </section>
                <h2>Cast
                    <button className={"toggle-full-cast"}
                            onClick={() => setDisplayAllCast(!displayAllCast)}>
                        Toggle Full Cast
                    </button>
                </h2>
                <div className={"credits"}>
                    {show.aggregate_credits.cast.map((cast: any, i: number) => {
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
                                    <b>{cast.name}</b> playing {cast.roles.length > 0 ? cast.roles[0].character : "Unknown"}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <h2>Seasons</h2>
                <div className={"seasons"}>
                    {show.seasons.map((season: any) => {
                        if(season.poster_path === null && season.air_date === null){
                            return <div></div>
                        }else{
                            return (
                                <div className={"season"}
                                     key={season.name}
                                     onClick={()=>selectSeason(season.season_number)}>
                                    <img src={"https://image.tmdb.org/t/p/w500/" + season.poster_path} className={"poster"}
                                         alt={"show-poster"}/>
                                    <div>{season.name}</div>
                                </div>
                            )
                        }
                    })}
                </div>
                <div className={"season-selector"}>
                    {[...seasons.keys()].map((seasonNumber: any) =>
                        <button onClick={()=>selectSeason(seasonNumber)} key={seasonNumber}>
                            {seasons?.get(seasonNumber)?.name}
                        </button>
                    )}
                </div>
                <div className={"selected-season"}>
                    {seasons?.get(selectedSeason)?.loading ? "loading":
                        <div>
                            {seasons?.get(selectedSeason)?.episodes.map((episode:any) => {
                                return (
                                    <div className={"season"} key={episode.id}>
                                        <img src={episode.still_path !== null ?
                                            "https://image.tmdb.org/t/p/w300/" + episode.still_path :
                                            "https://did-you-watch-avatars.s3.us-west-2.amazonaws.com/placeholder.jpg"}/>
                                        <div className={"info"}>
                                            <b>{episode.name}</b>
                                            <div>{episode.overview}</div>
                                            {matchingShow !== undefined && (
                                                episodesWatched.includes(episode.episode_number) ?
                                                        <button
                                                            onClick={() => markUnwatched(episode.season_number, episode.episode_number)}>
                                                            Mark Unwatched
                                                        </button> :
                                                        <button
                                                            onClick={() => markWatched(episode.season_number, episode.episode_number)}>
                                                            Mark Watched
                                                        </button>

                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
}