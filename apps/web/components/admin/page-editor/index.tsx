import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppMessage, Layout } from "@courselit/common-models";
import type { Address, Auth, Profile } from "@courselit/common-models";
import type { AppDispatch, AppState } from "@courselit/state-management";
import {
    networkAction,
    setAppMessage,
} from "@courselit/state-management/dist/action-creators";
import { debounce, FetchBuilder } from "@courselit/utils";
import { Button, Grid, Typography } from "@mui/material";
import { connect } from "react-redux";
import {
    EDIT_PAGE_BUTTON_DONE,
    EDIT_PAGE_BUTTON_UPDATE,
} from "../../../ui-config/strings";
import { useRouter } from "next/router";
import { canAccessDashboard } from "../../../ui-lib/utils";
import Template from "../../public/base-layout/template";
import dynamic from "next/dynamic";

const EditWidget = dynamic(() => import("./edit-widget"));
const AddWidget = dynamic(() => import("./add-widget"));
const WidgetsList = dynamic(() => import("./widgets-list"));

interface PageEditorProps {
    id: string;
    address: Address;
    auth: Auth;
    profile: Profile;
    dispatch: AppDispatch;
}

function PageEditor({ id, address, auth, profile, dispatch }: PageEditorProps) {
    const [page, setPage] = useState({});
    const [layout, setLayout] = useState([]);
    const [selectedWidget, setSelectedWidget] = useState<string>("");
    const [showWidgetSelector, setShowWidgetSelector] =
        useState<boolean>(false);
    const router = useRouter();
    // const debouncedSave = useCallback(
    //     debounce(
    //         async (pageId: string, layout: Record<string, unknown>[]) =>
    //             await savePage(pageId, layout),
    //         100
    //     ),
    //     []
    // );

    useEffect(() => {
        loadPage();
    }, []);

    useEffect(() => {
        if (profile.fetched && !canAccessDashboard(profile)) {
            router.push("/");
        }
    }, [profile.fetched]);

    useEffect(() => {
        if (auth.checked && auth.guest) {
            router.push(`/login?redirect=${router.asPath}`);
        }
    }, [auth.checked]);

    // useEffect(() => {
    //     console.log("Triggered");
    //     debouncedSave(page.pageId, layout);
    // }, [layout]);

    const onPublish = async () => {};

    const loadPage = async () => {
        const query = `
        query {
            page: getPage(id: "${id}") {
                pageId,
                name,
                layout,
                draftLayout
            }
        }
        `;
        await fetchPage(query);
    };

    const onWidgetClicked = (widgetId: string) => {
        setSelectedWidget(widgetId);
    };

    const fetchPage = async (query: string, noRefresh = false) => {
        const fetch = new FetchBuilder()
            .setUrl(`${address.backend}/api/graph`)
            .setPayload(query)
            .setIsGraphQLEndpoint(true)
            .build();
        try {
            dispatch(networkAction(true));
            const response = await fetch.exec();
            if (response.page) {
                const pageBeingEdited = response.page;
                if (!pageBeingEdited.draftLayout.length) {
                    setLayout(pageBeingEdited.layout);
                } else {
                    setLayout(pageBeingEdited.draftLayout);
                }
                setPage(pageBeingEdited);
            } else {
                dispatch(
                    setAppMessage(new AppMessage(`The page does not exist.`))
                );
                router.replace(`/dashboard/products`);
            }
        } catch (err: any) {
            dispatch(setAppMessage(new AppMessage(err.message)));
        } finally {
            dispatch(networkAction(false));
        }
    };

    const savePage = async (
        pageId: string,
        layout: Record<string, unknown>[]
    ) => {
        if (!pageId || !layout || !layout.length) return;

        const mutation = `
            mutation {
                page: savePage(pageData: {
                    pageId: "${pageId}",
                    layout: "${JSON.stringify(layout).replace(/"/g, '\\"')}"
                }) {
                    pageId,
                    name,
                    layout,
                    draftLayout
                }
            }
        `;
        await fetchPage(mutation, true);
    };

    const onWidgetSettingsChanged = (
        widgetId: string,
        settings: Record<string, unknown>
    ) => {
        const widgetIndex = layout.findIndex(
            (widget) => widget.widgetId === widgetId
        );
        layout[widgetIndex].settings = settings;
        setLayout([...layout]);
    };

    const onDelete = async (widgetId: string) => {
        const widgetIndex = layout.findIndex(
            (widget) => widget.widgetId === widgetId
        );
        layout.splice(widgetIndex, 1);
        await savePage(page.pageId, layout);
    };

    const addWidget = async (name: string) => {
        setShowWidgetSelector(false);
        layout.push({ name });
        await savePage(page.pageId, layout);
    };

    const onClose = () => {
        setSelectedWidget("");
    };

    const editWidget = useMemo(
        () => (
            <EditWidget
                widget={
                    page &&
                    layout.filter((x) => x.widgetId === selectedWidget)[0]
                }
                onChange={onWidgetSettingsChanged}
                onClose={onClose}
                onDelete={onDelete}
            />
        ),
        [selectedWidget]
    );

    return (
        <Grid container direction="column">
            <Grid
                item
                xs={12}
                container
                justifyContent="space-between"
                alignItems="center"
                sx={(theme: any) => ({
                    height: 48,
                    p: 1,
                    backgroundColor: "#eee",
                })}
            >
                <Grid item>
                    <Typography>{page.name}</Typography>
                </Grid>
                <Grid item>
                    <Button
                        onClick={() => savePage(page.pageId, layout)}
                        sx={{ mr: 1 }}
                    >
                        {EDIT_PAGE_BUTTON_DONE}
                    </Button>
                    <Button onClick={onPublish} variant="contained">
                        {EDIT_PAGE_BUTTON_UPDATE}
                    </Button>
                </Grid>
            </Grid>
            <Grid item>
                <Grid container>
                    <Grid item xs={3}>
                        {selectedWidget && editWidget}
                        {!selectedWidget && !showWidgetSelector && (
                            <WidgetsList
                                layout={layout}
                                onAddNewClick={() =>
                                    setShowWidgetSelector(true)
                                }
                                onItemClick={(widgetId: string) => {
                                    setLayout([...layout]);
                                    setSelectedWidget(widgetId);
                                }}
                            />
                        )}
                        {!selectedWidget && showWidgetSelector && (
                            <AddWidget
                                onSelection={addWidget}
                                onClose={(e) => setShowWidgetSelector(false)}
                            />
                        )}
                    </Grid>
                    <Grid item xs={9}>
                        <Template
                            layout={layout}
                            editing={true}
                            onEditClick={onWidgetClicked}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

const mapStateToProps = (state: AppState) => ({
    auth: state.auth,
    profile: state.profile,
    address: state.address,
});

const mapDispatchToProps = (dispatch: AppDispatch) => ({ dispatch });

export default connect(mapStateToProps, mapDispatchToProps)(PageEditor);