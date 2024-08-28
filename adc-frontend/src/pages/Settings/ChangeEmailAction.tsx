import {useEffect} from "react";
import {useParams} from "react-router-dom";
import {httpPut} from "../../utils/http.ts";
import {useDispatch} from "react-redux";
import {set} from "../../store/snackbar.ts";
import {logout} from "../../store/session.ts";

export default function ChangeEmailAction() {
    const param = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        httpPut("/users/change-email/" + param.verifyHash, {}).then(
            () => {
                dispatch(logout())
                window.location.reload();
            },
            () => {
                dispatch(
                    set({
                        open: true,
                        message: "An error has occurred",
                        type: "error",
                        autoHideDuration: 3000,
                    })
                );
            });
    }, [])

    return (
        <div />
    )
}