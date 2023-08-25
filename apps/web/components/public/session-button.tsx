import React from "react";
import Link from "next/link";
import { connect } from "react-redux";
import {
    GENERIC_SIGNOUT_TEXT,
    GENERIC_SIGNIN_TEXT,
} from "../../ui-config/strings";
import { Button } from "@courselit/components-library";
import Profile from "../../ui-models/profile";
import { AppState } from "@courselit/state-management";

interface SessionButtonProps {
    auth: any;
    profile: Profile;
}

function SessionButton(props: SessionButtonProps) {
    return (
        <>
            {props.auth.guest ? (
                <Link href="/login">
                    <Button component="link" href="/login">
                        {GENERIC_SIGNIN_TEXT}
                    </Button>
                </Link>
            ) : (
                <Link href="/logout">
                    <Button component="link" href="/logout">
                        {GENERIC_SIGNOUT_TEXT}
                    </Button>
                </Link>
            )}
        </>
    );
}

const mapStateToProps = (state: AppState) => ({
    auth: state.auth,
    profile: state.profile,
});

export default connect(mapStateToProps)(SessionButton);
