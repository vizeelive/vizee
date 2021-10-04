import React, {useState} from 'react'
import "../styles/TagCloud.css"
import { Tag } from 'antd';
const {CheckableTag} = Tag;

export default function TagCloud({
   selectedTags = [],
   availableTags = [],
   onTagSelected = () => {},
   className
}) {

  const handleTagClick = (tag) => {
    const currentSelectedTags = new Set(selectedTags);
    if(currentSelectedTags.has(tag)) {
      currentSelectedTags.delete(tag);
    } else {
      currentSelectedTags.add(tag, true);
    }
    onTagSelected(tag, [...currentSelectedTags]);
  }

  const classNames = ["tag-cloud"];
  className && classNames.push(className);

  return (
    <ul className={classNames.join(" ")}>
      {availableTags.map((tag) => {
          return (
            <li key={tag} className="tag-cloud__item">
              <CheckableTag className="border-gray-700" onChange={(checked) => handleTagClick(tag)} key={tag} checked={selectedTags.indexOf(tag) > -1}>{tag}</CheckableTag>
            </li>
          )
      })}
    </ul>
  )
}
