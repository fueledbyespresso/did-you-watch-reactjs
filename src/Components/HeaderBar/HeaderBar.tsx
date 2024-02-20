import {QuickSearch} from "../Search/QuickSearch.tsx";
import {AccountDropdown} from "../AccountDropdown/AccountDropdown";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState, UserState} from "../../Store/userSlice";

export function HeaderBar() {
    const user = useSelector<RootState, UserState>((state) => state.user);

    return (
        <div className={"header-bar"}>
            <AccountDropdown/>
            <QuickSearch/>
            <div className={"links"}>
                <NavLink className={({isActive}) => (isActive ? 'active' : 'inactive')} to={"/"}>Trending</NavLink>
                {user !== null &&
                    <>
                        <NavLink className={({isActive}) => (isActive ? 'active' : 'inactive')} to={"/my-movies"}>
                            Movies
                        </NavLink>
                        <NavLink className={({isActive}) => (isActive ? 'active' : 'inactive')} to={"/my-shows"}>
                            Shows
                        </NavLink>
                        <NavLink className={({isActive}) => (isActive ? 'active' : 'inactive')} to={"/search"}>
                            Search
                        </NavLink>
                    </>
                }
            </div>
        </div>
    )
}