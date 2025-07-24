defmodule RotomWeb.RoomController do
  use RotomWeb, :controller

  alias Rotom.Chat

  def redirect_to_first(conn, _params) do
    path =
      case Chat.list_joined_rooms(conn.assigns.current_user) do
        [] -> ~p"/rooms"
        [first, _] -> ~p"/rooms/#{first}"
      end

    redirect(conn, path)
  end
end
