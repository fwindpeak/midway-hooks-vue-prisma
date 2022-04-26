<template>
  <h1>Blogs</h1>
  <div class="post-list" v-if="posts">
    <ul>
      <li v-for="post in posts">
        <h2>{{ post.title }}</h2>
        <div>
          {{ post.content }}
        </div>
      </li>
    </ul>
  </div>
  <input type="text" v-model="title" placeholder="Title" />
  <textarea rows="10" v-model="content" placeholder="Content"></textarea>
  <button @click="addBlog">Add Blog</button>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { listPosts, createPost } from '../api/blog'
const posts = ref(null)
const content = ref('')
const title = ref('')

async function refresh() {
  posts.value = await listPosts()
  console.log(posts)
}

async function addBlog() {
  let res = await createPost({
    title: title.value,
    content: content.value,
    authorEmail: 'alice@prisma.io'
  })
  console.log(res)
  refresh()
}

refresh()
</script>

<style></style>
