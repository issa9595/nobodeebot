exports.peopleEmbed = (people) => {
  const { id, avatar, globalName, username } = people.user;
  const { nickName, displayName } = people;
  const icon_url = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
  const name = nickName || displayName || globalName || username;
  return {
    author: {
      name,
      icon_url,
    },
  };
};
