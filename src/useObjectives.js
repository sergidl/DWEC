import { useEffect, useState } from 'react';

export const useObjectives = (initialObjectives = []) => {
    let list=document.getElementById("objectives")
  const [objectives, setObjectives] = useState(initialObjectives);

  useEffect(()=>{
      console.log(objectives)
  },[objectives])
  const addObjective = (newObjective) => {
    setObjectives([...objectives, newObjective]);
  };

  const updateObjective = (updatedObjective) => {
    setObjectives(objectives.map(obj => obj.id === updatedObjective.id ? updatedObjective : obj));
  };

  const deleteObjective = (objectiveId) => {
    setObjectives(objectives.filter(obj => obj.id !== objectiveId));
  };

  return [objectives, addObjective, updateObjective, deleteObjective];
};