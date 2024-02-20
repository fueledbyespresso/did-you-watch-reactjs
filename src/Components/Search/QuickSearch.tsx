import {useState} from "react";
import {User} from "../../Types/User";
import {SearchResultShowCard} from "./SearchResultShowCard.tsx";
import {SearchResultMovieCard} from "./SearchResultMovieCard.tsx";
import {ActorResultCard} from "./ActorResultCard";

export function QuickSearch() {
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [searchResults, setSearchResults] = useState<any>(null)

    function submitSearch() {
        if (searchQuery === ""){
            setSearchResults(null)
            return
        }
        const endpoint ="https://api.themoviedb.org/3/search/multi?api_key=" + import.meta.env.VITE_TMDB_KEY + "&query=" + searchQuery + "&page=1"

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
                    console.log(result.results)
                    setSearchResults(result.results)
                }, (error) => {
                    console.log(error)
                }
            )
    }

    return (
        <div className={"search-area"} tabIndex={3}>
            <form className={"search-bar"} onSubmit={(e)=>e.preventDefault()}>
                <input className={"search-input"}
                       tabIndex={2}
                       value={searchQuery}
                       onChange={event => setSearchQuery(event.target.value)}
                       onKeyUp={() => (submitSearch())}
                       placeholder={"Search..."}
                       onKeyUpCapture={(e)=>{
                           if (e.key === "Escape"){
                               setSearchQuery("")
                               setSearchResults(null)
                           }
                       }}
                       autoFocus={true}></input>
                {(searchQuery !== "" || searchResults !== null) &&
                    <input type="reset" value="X" alt="Clear the search form" onClick={() => {
                        setSearchQuery("")
                        setSearchResults(null)
                    }}/>
                }
            </form>
            {searchResults !== null && <div className="results">
                {searchResults.map((searchResult: any) => {
                    const media = searchResult.media_type
                    switch (media) {
                        case "tv":
                            return <SearchResultShowCard show={searchResult} key={searchResult.id}/>
                        case "movie":
                            return <SearchResultMovieCard movie={searchResult} key={searchResult.id}/>
                        case "user":
                            return <User user={searchResult} key={searchResult.key}/>
                        case "person":
                            return <ActorResultCard actor={searchResult} actorID={searchResult.id} key={searchResult.id}/>
                        default: return <div></div>
                    }
                })}
            </div>}
        </div>
    )
}
