import React, { Component } from 'react';
import PropTypes from 'prop-types';

import api from '../../services/api';

import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  StarsList,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
} from './styles';

export default class User extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      setOptions: PropTypes.func,
    }).isRequired,
    route: PropTypes.shape({
      params: PropTypes.shape({
        user: PropTypes.shape({
          name: PropTypes.string,
          login: PropTypes.string,
          avatar: PropTypes.string,
          bio: PropTypes.string,
        }),
      }),
    }).isRequired,
  };

  state = {
    stars: [],
  };

  async componentDidMount() {
    const { navigation, route } = this.props;
    const { user } = route.params;

    navigation.setOptions({
      title: user.name,
    });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data });
  }

  render() {
    const { route } = this.props;
    const { stars } = this.state;
    const { user } = route.params;

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>

        <StarsList
          data={stars}
          keyExtractor={(starsItem) => String(starsItem.id)}
          renderItem={({ item }) => (
            <Starred>
              <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
              <Info>
                <Title>{item.name}</Title>
                <Author>{item.owner.login}</Author>
              </Info>
            </Starred>
          )}
        />
      </Container>
    );
  }
}
