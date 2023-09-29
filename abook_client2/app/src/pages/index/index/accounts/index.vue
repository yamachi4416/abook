<template>
  <div>
    <NuxtLayout>
      <template #title>{{ $t('pages.accounts.index.title') }}</template>
      <table>
        <thead>
          <tr>
            <th>{{ $t('form.financeName') }}</th>
            <th>{{ $t('form.name') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ id, financeDiv, color, name } in accounts" :key="id">
            <td>{{ $t(`select.financeDiv.${financeDiv}.label`) }}</td>
            <td>
              <span :style="{ color }">●</span>
              <NuxtLink :to="`/accounts/${id}`">{{ name }}</NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>
      <template #footer>
        <NuxtLink to="/accounts/new">{{ $t('actions.add') }}</NuxtLink>
      </template>
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { accountsService } from '@abook/models'

const { accounts } = await setup()

async function setup() {
  const api = useApiRequest()
  const { getAllAccounts } = accountsService({ api })
  const accounts = await getAllAccounts()
  return {
    accounts,
  }
}
</script>
