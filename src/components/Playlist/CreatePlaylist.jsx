import React from 'react'

function CreatePlaylist({ events }) {
  return (
    <div>
      {events.map((event) => {
        return (
          <h1>{event.name}</h1>
        );
      })}
    </div>
  )
}

export default CreatePlaylist
