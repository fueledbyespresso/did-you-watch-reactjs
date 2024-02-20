import {useState} from "react";
import Select from "react-select";
import {User} from "../Types/User.tsx";


const options = [
    {value: 'multi', label: 'Multi'},
    {value: 'tv', label: 'TV'},
    {value: 'movie', label: 'Movie'},
    {value: 'users', label: 'Users'},
]

export function SearchPage() {
    const [curCategory, setCurCategory] = useState<string | undefined>("multi")
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
                    console.log(result.results)
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
                       placeholder={"The Last of Us..."}
                       autoFocus={true}/>
                <Select options={options}
                        tabIndex={1}
                        defaultValue={{value: 'multi', label: 'Multi'}}
                        onChange={(values) => {
                            setCurCategory(values?.value)
                            setSearchResults(null)
                        }}
                        className="category-select"/>
            </div>
            {searchResults !== null && <div className="results">
                {searchResults.map((searchResult: any) => {
                    const media = searchResult.media_type || curCategory
                    switch (media) {
                        case "tv":
                            return <div>{searchResult.name}</div>
                        case "movie":
                            return <div>{searchResult.title}</div>
                            case "user":
                                return <User user={searchResult} key={searchResult.key}/>
                            case "person":
                                return <div>{searchResult.name}</div>
                            default:
                                return <div></div>
                        }
                    })}
                </div>}
        </div>
    )
}
