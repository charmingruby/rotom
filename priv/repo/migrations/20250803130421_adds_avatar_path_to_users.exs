defmodule Rotom.Repo.Migrations.AddsAvatarPathToUsers do
  use Ecto.Migration

  def change do
    alter table(:users) do
      add :avatar_path, :string
    end
  end
end
