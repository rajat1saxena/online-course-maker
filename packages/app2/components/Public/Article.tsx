import React from "react";
import { styled } from "@mui/system";
import { Typography, Grid, Divider, Chip } from "@mui/material";
import Link from "next/link";
import { formattedLocaleDate, checkPermission } from "../../ui-lib/utils";
import { connect } from "react-redux";
import {
  PriceTag,
  RichText as TextEditor,
  Section,
  Image,
} from "@courselit/components-library";
import { FREE_COST } from "../../ui-config/strings";
import dynamic from "next/dynamic";
import constants from "../../config/constants";
import { AppState } from "@courselit/state-management";
import { Course, Profile, SiteInfo } from "@courselit/common-models";

const { permissions } = constants;

const PREFIX = "Article";

const classes = {
  header: `${PREFIX}-header`,
  creatoravatarcontainer: `${PREFIX}-creatoravatarcontainer`,
  creatorcard: `${PREFIX}-creatorcard`,
  creatoravatar: `${PREFIX}-creatoravatar`,
  creatorName: `${PREFIX}-creatorName`,
  enrollmentArea: `${PREFIX}-enrollmentArea`,
  enrollmentAreaPriceTag: `${PREFIX}-enrollmentAreaPriceTag`,
  content: `${PREFIX}-content`,
};

const StyledSection = styled(Section)(({ theme }: { theme: any }) => ({
  [`& .${classes.header}`]: {},

  [`& .${classes.creatoravatarcontainer}`]: {
    display: "flex",
    alignItems: "center",
  },

  [`& .${classes.creatorcard}`]: {
    marginTop: theme.spacing(1),
  },

  [`& .${classes.creatoravatar}`]: {
    borderRadius: "1.5em",
    width: "3em",
    marginRight: "1em",
  },

  [`& .${classes.creatorName}`]: {
    color: "inherit",
  },

  [`& .${classes.enrollmentArea}`]: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(4),
  },

  [`& .${classes.enrollmentAreaPriceTag}`]: {},

  [`& .${classes.content}`]: {
    marginTop: theme.spacing(4),
  },
}));

const BuyButton = dynamic(() => import("./Checkout"));

interface ArticleProps {
  course: Course;
  options: ArticleOptionsProps;
  profile: Profile;
  siteInfo: SiteInfo;
}

interface ArticleOptionsProps {
  showAttribution: boolean;
  showEnrollmentArea: boolean;
}

const Article = (props: ArticleProps) => {
  const { course, options, profile } = props;

  let courseDescriptionHydrated;
  try {
    courseDescriptionHydrated = TextEditor.hydrate({
      data: course.description,
    });
  } catch (err) {}

  return (
    <StyledSection>
      <article>
        <header>
          <Typography variant="h2" className={classes.header}>
            {course.title}
          </Typography>
        </header>
        {options.showAttribution && (
          <Grid
            container
            className={classes.creatorcard}
            direction="column"
            spacing={2}
          >
            <Grid item>
              <Typography variant="overline" component="p">
                <Link href="/profile/[id]" as={`/profile/${course.creatorId}`}>
                  <a className={classes.creatorName}>{course.creatorName}</a>
                </Link>
              </Typography>
              <Typography variant="overline" className={classes.updatedtime}>
                {formattedLocaleDate(course.updatedAt)}
              </Typography>
            </Grid>
          </Grid>
        )}
        {course.featuredImage && (
          <Image
            alt={course.featuredImage.caption}
            src={course.featuredImage.file}
          />
        )}
        {options.showEnrollmentArea &&
          (profile.fetched
            ? !profile.purchases.includes(course.id) &&
              checkPermission(profile.permissions, [permissions.enrollInCourse])
            : true) && (
            <div className={classes.enrollmentArea}>
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Grid item className={classes.enrollmentAreaPriceTag}>
                  <PriceTag
                    cost={course.cost}
                    freeCostCaption={FREE_COST}
                    siteInfo={props.siteInfo}
                  />
                </Grid>
                <Grid>
                  <BuyButton course={course} />
                </Grid>
              </Grid>
            </div>
          )}
        {courseDescriptionHydrated && process.browser && (
          <div className={classes.content}>
            <TextEditor
              initialContentState={courseDescriptionHydrated}
              readOnly={true}
            />
          </div>
        )}
        <Grid container alignItems="center" spacing={1}>
          <Grid item>
            <Typography variant="h6">Tags </Typography>
          </Grid>
          <Grid item>
            {course.tags.map((tag: string) => (
              <Link href={`/tag/${tag}`} key={tag}>
                <Chip label={tag} component="a" clickable />
              </Link>
            ))}
          </Grid>
        </Grid>
      </article>
    </StyledSection>
  );
};

const mapStateToProps = (state: AppState) => ({
  profile: state.profile,
  siteInfo: state.siteinfo,
});

export default connect(mapStateToProps)(Article);
