FROM mcr.microsoft.com/dotnet/sdk:5.0-alpine AS build
WORKDIR /source

COPY src/AbookApi/*.csproj      ./src/AbookApi/
COPY src/AbookUseCase/*.csproj  ./src/AbookUseCase/
COPY src/AppBase/*.csproj       ./src/AppBase/
RUN dotnet restore src/AbookApi

COPY src/AbookApi/      ./src/AbookApi/
COPY src/AbookUseCase/  ./src/AbookUseCase/
COPY src/AppBase/       ./src/AppBase/


FROM build AS test
WORKDIR /source
COPY *.sln      ./
COPY test/     ./test/
ENV ASPNETCORE_ENVIRONMENT=Test
ENTRYPOINT ["dotnet", "test", "-c", "Release", "-p:CollectCoverage=true", "-p:CoverletOutputFormat=cobertura"]


FROM build AS publish
WORKDIR /source/src/AbookApi
RUN dotnet publish -c Release -r linux-musl-x64 \
    --self-contained=true \
    -p:PublishSingleFile=true \
    -o /app

FROM mcr.microsoft.com/dotnet/runtime-deps:5.0-alpine
WORKDIR /app
COPY --from=publish /app/AbookApi ./
COPY --from=publish /app/appsettings.json ./
ENTRYPOINT ["./AbookApi"]
