

interface CourseArrayNode {
  id: number;
  name: string;
  parent_id: number;
}
export interface CourseTree {
  [id: number]: CourseTreeNode;
}
export interface CourseTreeNode {
  id: number;
  name: string;
  children: number[];
  parentId: number | null;

}


const getCourseTree = (searchString: string) => {
  //TODO empty string
  return fetch(`https://coursetreesearch-service-sandbox.dev.tophat.com/?query=${searchString}`)
    .then(response => {
      const defaultErrorMessage = "Failed to receive course tree array from API"
      return response.json()
        .catch(error => ({ detail: error.message ?? defaultErrorMessage }))
        .then(data => {
          if (!response.ok || !Array.isArray(data)) {
            throw new Error(data?.detail ?? defaultErrorMessage)
          }
          return data;
        })
    })
    .then(data => parseCourseTree(data))
    .catch(error => {
      console.error(error)
      throw new Error("Failed to retrieve results. Please try again later. If the problem persists, please contact support.")
    })
}

const parseCourseTree = (courseArray: CourseArrayNode[]) => {
  if (!courseArray.length) {
    return {};
  }

  const courseTree: CourseTree = {
    0: {
      id: 0,
      name: "rootCourses",
      children: [],
      parentId: null,
    }
  };

  // add all courses to the hashmap
  courseArray.forEach(course => {
    if (!courseTree[course.id]) {
      courseTree[course.id] = {
        id: course.id,
        name: course.name,
        children: [],
        parentId: course.parent_id,
      }
    }
  })

  // add all children
  courseArray.forEach(course => {
    if (courseTree[course.parent_id]) {
      // insert the course in the correct position, so no need to sort later
      const children = courseTree[course.parent_id].children;
      const insertIndex = children.findIndex(id => id > course.id);
      if (insertIndex === -1) {
        children.push(course.id);
      } else {
        children.splice(insertIndex, 0, course.id);
      }
    } else {
      // Ignoring courses with parent not found for now, but this should be corrected in the API
      console.error(`Course ${course.id}'s parent ${course.parent_id} not found.`);
    }
  })

  return courseTree;
}

export { getCourseTree }