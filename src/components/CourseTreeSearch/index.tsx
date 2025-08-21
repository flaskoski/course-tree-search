import { useMutation } from "@tanstack/react-query";
import { useState, type JSX } from "react";
import { getCourseTree } from "../../services/CourseTree";
import type { CourseTree, CourseTreeNode } from "../../services/CourseTree";
import "./styles.css";

const CourseTreeNodeComponent = ({ courseTree, course, level }: { courseTree: CourseTree, course: CourseTreeNode, level: number }): JSX.Element => {
  return (
    <>
      {level > 0 && <li key={course.id}>{Array(level - 1).fill('- ').join('')} {course.name}</li>}
      {course.children.map(childId => <CourseTreeNodeComponent key={childId} courseTree={courseTree} course={courseTree[childId]} level={level + 1} />)}
    </>
  )
}

const CourseTreeSearchComponent = () => {
  const [searchString, setSearchString] = useState<string>('');
  const { mutate: searchTree, isPending, isError, data: courseTreeApiData, error } = useMutation({
    mutationFn: (searchString: string) => getCourseTree(searchString),
  });

  const handleSearch = () => {
    searchTree(searchString);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchString.trim().length) {
      handleSearch();
    }
  }


  return (
    <section>
      <h1 className="courseTreeTitle">Course Tree Search</h1>
      <div className="courseTreeSearch">
        <input onKeyDown={handleKeyDown} className="courseTreeSearch__input" type="text" value={searchString} onChange={(e) => setSearchString(e.target.value)} />
        <button className="courseTreeSearch__button" disabled={!searchString.trim().length} onClick={handleSearch}>Search</button>
      </div>
      {courseTreeApiData?.[0] ?
        < ul className="courseTreeList">
          <CourseTreeNodeComponent courseTree={courseTreeApiData} course={courseTreeApiData[0]} level={0} />
        </ul>
        : isError ? <p>Error: {error?.message}</p> :
          isPending ? <p>Loading...</p> :
            <p>No results found</p>}
    </section >
  )
}

export default CourseTreeSearchComponent;