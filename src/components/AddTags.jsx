import React, {useEffect, useLayoutEffect, useState, useRef} from 'react';
import { Tag, Input, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import '../styles/AddTags.css';

export default function AddTags({onTagsUpdated, existingTags=[]}) {
  const [tags, setTags] = useState(existingTags);
  const [options, setOptions] = useState({
    inputVisible: false,
    inputValue: '',
    editInputIndex: -1,
    editInputValue: '',
  })

  const inputElRef = useRef(null);
  const editInputRef = useRef(null);

  useEffect(() => {
    editInputRef && editInputRef?.current?.focus();
  }, [options.editInputIndex])

  useEffect(() => {
    options.inputVisible && inputElRef && inputElRef?.current?.focus();
  }, [options.inputVisible])

  useEffect(() => {
    onTagsUpdated(tags);
  }, [tags])

  const handleClose = removedTag => {
    setTags(tags.filter(tag => tag !== removedTag))
  };

  const showInput = () => {
    setOptions({ ...options, inputVisible: true });
  };

  const handleInputChange = e => {
    setOptions({ ...options, inputValue: e.target.value });
  };

  const handleInputConfirm = () => {
    const { inputValue } = options;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }

    setOptions({
      ...options,
      inputVisible: false,
      inputValue: '',
    });
  };

  const handleEditInputChange = e => {
    setOptions({ ...options, editInputValue: e.target.value });
  };

  const handleEditInputConfirm = () => {

    setTags((tags) => {
      const newTags = [...tags];
      newTags[editInputIndex] = editInputValue;
      return newTags;
    });

    setOptions({...options,
      editInputIndex: -1,
      editInputValue: ''
    })
  };

  const { inputVisible, inputValue, editInputIndex, editInputValue } = options;
  return (
    <>
      {[...tags].sort().map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              className="add-tags__input"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }

        const isLongTag = tag.length > 20;

        const tagElem = (
          <Tag
            className="add-tags__tag"
            key={tag}
            closable={true}
            onClose={() => handleClose(tag)}
          >
              <span
                onClick={e => {
                    setOptions({ editInputIndex: index, editInputValue: tag })
                    //editInputRef.focus();
                    e.preventDefault();
                }}
              >
                {tag}
              </span>
          </Tag>
        );
        return isLongTag ? (
          <Tooltip title={tag} key={tag}>
            {tagElem}
          </Tooltip>
        ) : (
          tagElem
        );
      })}
      {inputVisible && (
        <Input

          ref={inputElRef}
          type="text"
          className="add-tags__input"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!inputVisible && (
        <Tag className="add-tags__plus" onClick={showInput}>
          <PlusOutlined /> add
        </Tag>
      )}
    </>
  );

}

