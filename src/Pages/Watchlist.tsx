import {Movies} from "../Components/WatchList/Movies/Movies";
import {Shows} from "../Components/WatchList/Shows/Shows";

export function Watchlist(props: { category: string }) {
    return (
        <div className={"watchlist"}>
            {props.category === "movies" && <Movies/>}
            {props.category === "shows" && <Shows/>}
        </div>
    )
}