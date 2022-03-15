import React, { useEffect, useState } from "react";
import { styled } from '@mui/material/styles';
import PropTypes from "prop-types";
import {
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from "@mui/material";
import { connect } from "react-redux";
import {
  MANAGE_COURSES_PAGE_HEADING,
  COURSE_TYPE_BLOG,
  COURSE_TYPE_COURSE,
  LOAD_MORE_TEXT,
  SEARCH_TEXTBOX_PLACEHOLDER,
} from "../../../config/strings";
import FetchBuilder from "../../../lib/fetch";
import { addressProps, authProps, profileProps } from "../../../types";
import { Section } from "../../ComponentsLibrary";
import dynamic from "next/dynamic";
import { networkAction } from "../../../redux/actions";
import { checkPermission } from "../../../lib/utils";
import { permissions } from "../../../config/constants";
import { Add, Search } from "@mui/icons-material";
import Link from "next/link";

const PREFIX = 'index';

const classes = {
  avatar: `${PREFIX}-avatar`,
  listItem: `${PREFIX}-listItem`,
  listItemText: `${PREFIX}-listItemText`
};

const StyledGrid = styled(Grid)((
  {
    theme
  }
) => ({
  [`& .${classes.avatar}`]: {
    height: "50px !important",
    [theme.breakpoints.up("md")]: {
      height: "100px !important",
    },
    width: "auto !important",
    background: "red",
  },

  [`& .${classes.listItem}`]: {
    cursor: "pointer",
  },

  [`& .${classes.listItemText}`]: {
    paddingLeft: theme.spacing(1),
  }
}));

const Img = dynamic(() => import("../../Img.js"));

const Index = (props) => {
  const [coursesPaginationOffset, setCoursesPaginationOffset] = useState(1);
  const [creatorCourses, setCreatorCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchState, setSearchState] = useState(0);


  useEffect(() => {
    loadCreatorCourses();
  }, []);

  useEffect(() => {
    loadCreatorCourses();
  }, [searchState]);

  const loadCreatorCourses = async () => {
    const query = searchText
      ? `
    query {
      courses: getCoursesAsAdmin(
        offset: ${coursesPaginationOffset},
        searchText: "${searchText}"
      ) {
        id,
        title,
        featuredImage {
          thumbnail
        },,
        isBlog,
        courseId
      }
    }
    `
      : `
    query {
      courses: getCoursesAsAdmin(
        offset: ${coursesPaginationOffset}
      ) {
        id,
        title,
        featuredImage {
          thumbnail
        },,
        isBlog,
        courseId
      }
    }
    `;
    const fetch = new FetchBuilder()
      .setUrl(`${props.address.backend}/graph`)
      .setPayload(query)
      .setIsGraphQLEndpoint(true)
      .setAuthToken(props.auth.token)
      .build();
    try {
      props.dispatch(networkAction(true));
      const response = await fetch.exec();
      if (response.courses && response.courses.length > 0) {
        setCreatorCourses([...creatorCourses, ...response.courses]);
        setCoursesPaginationOffset(coursesPaginationOffset + 1);
      }
    } catch (err) {
    } finally {
      props.dispatch(networkAction(false));
    }
  };

  const searchCourses = async (e) => {
    e.preventDefault();

    setCoursesPaginationOffset(1);
    setCreatorCourses([]);
    setSearchState(searchState + 1);
  };

  return (
    <StyledGrid container direction="column" spacing={2}>
      <Grid item xs={12}>
        <Section>
          <Grid
            container
            justifyContent="space-between"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <Typography variant="h1">
                {MANAGE_COURSES_PAGE_HEADING}
              </Typography>
            </Grid>
            <Grid item>
              <form onSubmit={searchCourses}>
                <FormControl variant="outlined">
                  <InputLabel htmlFor="searchtext">
                    {SEARCH_TEXTBOX_PLACEHOLDER}
                  </InputLabel>
                  <OutlinedInput
                    id="searchtext"
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton aria-label="search" edge="end" type="submit" size="large">
                          <Search />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
              </form>
            </Grid>
          </Grid>
        </Section>
      </Grid>
      <Grid item xs={12}>
        <Section>
          <Grid container direction="column" spacing={2}>
            {checkPermission(props.profile.permissions, [
              permissions.manageCourse,
            ]) && (
              <Grid item>
                <Link href="/dashboard/courses/edit">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<Add />}
                  >
                    Add new
                  </Button>
                </Link>
              </Grid>
            )}
            <Grid item>
              <List>
                {creatorCourses.map((course, index) => (
                  <Link
                    href={`/dashboard/courses/edit/${course.courseId}`}
                    key={index}
                  >
                    <ListItem className={classes.listItem}>
                      <ListItemAvatar>
                        <Img
                          src={
                            course.featuredImage &&
                            course.featuredImage.thumbnail
                          }
                          classes={classes.avatar}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={course.title}
                        secondary={
                          course.isBlog ? COURSE_TYPE_BLOG : COURSE_TYPE_COURSE
                        }
                        className={classes.listItemText}
                      />
                    </ListItem>
                  </Link>
                ))}
              </List>
            </Grid>
            <Grid item>
              <Button variant="outlined" onClick={loadCreatorCourses}>
                {LOAD_MORE_TEXT}
              </Button>
            </Grid>
          </Grid>
        </Section>
      </Grid>
    </StyledGrid>
  );
};

Index.propTypes = {
  auth: authProps,
  profile: profileProps,
  dispatch: PropTypes.func.isRequired,
  address: addressProps,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile,
  address: state.address,
});

export default connect(mapStateToProps)(Index);