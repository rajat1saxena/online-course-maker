import * as React from "react";
import {
  WidgetProps,
  WidgetHelpers,
  RichText as TextEditor,
  Section,
} from "@courselit/components-library";
import { Button, Grid, Typography } from "@material-ui/core";
import Settings from "./Settings";

export interface AboutWidgetProps extends WidgetProps {
  auth: any;
  dispatch: any;
}

const AdminWidget = (props: AboutWidgetProps) => {
  const { fetchBuilder, dispatch, name, auth } = props;
  const [settings, setSettings] = React.useState<Settings>({
    text: TextEditor.emptyState(),
  });
  const [newSettings, setNewSettings] = React.useState<Settings>(settings);

  React.useEffect(() => {
    getSettings();
  }, []);

  React.useEffect(() => {
    console.log(props);
  });

  const getSettings = async () => {
    const settings = await WidgetHelpers.getWidgetSettings({
      widgetName: name,
      fetchBuilder,
      dispatch,
    });

    if (settings) {
      onNewSettingsReceived(settings);
    }
  };

  const onNewSettingsReceived = (settings: any) => {
    const newSettings = Object.assign({}, settings, {
      text: settings.text
        ? TextEditor.hydrate({ data: settings.text })
        : TextEditor.emptyState(),
    });
    setSettings(newSettings);
    setNewSettings(newSettings);
  };

  const saveSettings = async (event: any) => {
    event.preventDefault();

    const result = await WidgetHelpers.saveWidgetSettings({
      widgetName: name,
      newSettings: Object.assign({}, newSettings, {
        text: TextEditor.stringify(newSettings.text),
      }),
      fetchBuilder,
      auth,
      dispatch,
    });
    onNewSettingsReceived(result);
  };

  const isDirty = (): boolean => {
    return settings !== newSettings;
  };

  const onChangeData = (editorState: any) => {
    setNewSettings(
      Object.assign({}, newSettings, {
        text: editorState,
      })
    );
  };

  return (
    <Section>
      <Grid container direction="column" spacing={2}>
        <Grid item xs>
          <Typography variant="h6" color="textSecondary">
            Compose
          </Typography>
        </Grid>
        <Grid item>
          <form onSubmit={saveSettings}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <TextEditor
                  initialContentState={settings.text}
                  onChange={onChangeData}
                />
              </Grid>
              <Grid item>
                <Button type="submit" value="Save" disabled={!isDirty()}>
                  Save
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Section>
  );
};

export default AdminWidget;
