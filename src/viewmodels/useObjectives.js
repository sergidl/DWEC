import { useEffect, useState } from 'react';

export const useObjectives = () => {
  const [objectives, setObjectives] = useState(JSON.parse(localStorage.getItem("objectives")) || []);

  useEffect(()=>{
      localStorage.setItem("objectives",JSON.stringify(objectives))
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