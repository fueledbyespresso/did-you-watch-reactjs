import {Show} from "../../Types/Show";
import {Link} from "react-router-dom";

export function TrendingShow(props: { show: Show }) {
    const date = new Date(props.show.first_air_date)
    let dateStr = date.toDateString()
    if(dateStr === "Invalid Date"){
        dateStr = "Unannounced release date"
    }else{
        dateStr = date.toDateString()
    }

    return (
        <div className={"trending-film"}>
            <Link to={"/show/" + props.show.id}>
                <img src={"https://image.tmdb.org/t/p/w500/" + props.show.poster_path} className={"poster"}
                     alt={"show-poster"}/>
            </Link>
            <div className={"name"}>{props.show.original_name}</div>
            <div className={"air-date"}>{dateStr}</div>
        </div>
    )
}